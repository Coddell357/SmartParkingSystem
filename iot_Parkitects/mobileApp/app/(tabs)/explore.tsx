//(Withfra.me, 2022)
import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import { ThemedText as Text } from '@/components/themed-text';
import FeatherIcon from '@expo/vector-icons/Feather';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAccessibility } from '@/context/accessibilityContext';
import StatsCard from '@/components/ticket/StatsCard';
import { useRouter, useFocusEffect } from 'expo-router';
import { auth } from '../../config/firebaseConfig';
import DropDownPicker from 'react-native-dropdown-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



const cancellationReasons = [
  {
    id: 1,
    reason: 'Parked skew',
    description: 'The vehicle is parked in two bays',
  },
  {
    id: 2,
    reason: 'Lights are on',
    description: 'The vehicles lights are on',
  },
  {
    id: 3,
    reason: 'Vehicle outside bay',
    description: 'Vehicle is to far out of the parking bay',
  },
  {
    id: 4,
    reason: 'Restricted parking',
    description: 'Lecturer parking only',
  },
  {
    id: 5,
    reason: 'Other reason',
    description: 'None of the above reasons apply',
  },
];

// Jayasekara, 2025- Dropdown array
type BayItem = { label: string; value: string; section: string; number: string };

export default function Example() {

  const { theme, colorMode, triggerHaptic, triggerScreenReader } = useAccessibility();

  const router = useRouter();
  const insets = useSafeAreaInsets();

  //
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [items, setItems] = useState<BayItem[]>([]);

  //Adeoye,2024
  const [loading, setLoading] = useState(false);// updates the UI to show that the request is happening
  const [form, setForm] = useState({
    bio: "",
    reasonId: 0,
    parkingBay: '',
    bayId: '',
    sectionId: '',
    imageUri: null as string | null,

  });

  // Only bays that currently have a registered driver
  const loadOccupiedBays = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Parking/occupied`);
      if (!response.ok) throw new Error('Failed to load bays');
      const bays: { bayID: number; bayNumber: string }[] = await response.json();

      const list: BayItem[] = bays.map(b => ({
        label: `Bay ${b.bayNumber}`,
        value: b.bayNumber,
        section: `${b.bayNumber.charAt(0)}-Block`,
        number: b.bayNumber,
      }));

      setItems(list);
      // If the selected bay is no longer occupied, clear the selection
      setValue(prev => (prev && list.some(i => i.value === prev) ? prev : null));
    } catch (error) {
      console.error('Failed to load occupied bays', error);
      setItems([]);
    }
  };

  // Reload every time so that the list is up to date
  useFocusEffect(
    useCallback(() => {
      loadOccupiedBays();
    }, [])
  );

  // Recovers the camera photo if Android restarted the app while the camera was open
  useEffect(() => {
    (async () => {
      try {
        const pending = await ImagePicker.getPendingResultAsync();
        if (pending && 'assets' in pending && pending.assets?.length) {
          setForm(prev => ({ ...prev, imageUri: pending.assets[0].uri }));
        }
      } catch (error) {
        console.error('Failed to recover pending image result', error);
      }
    })();
  }, []);

  // Jayasekara, 2025 - handler keeping the form synced on value change
  const handleBayChange = (val: any) => {
    const selectedValue = typeof val === 'function' ? val(value) : val;
    setValue(selectedValue);

    const selected = items.find(b => b.value === selectedValue);
    if (selected) {
      setForm(prev => ({
        ...prev,
        bayId: selected.value,
        parkingBay: selected.number,
        sectionId: selected.section,
      }));
    }
  };


  /*Kindacode.com,2022
  Pick Image from Gallery or Camera*/
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()// Get permission from user
    if (!permissionResult.granted) {
      Alert.alert('You have refused to allow this app to access your photos!', 'Permission to access media files is required')
      return;
    }


    const result = await ImagePicker.launchImageLibraryAsync({ // user Explore the result
      mediaTypes: ['images'],
      quality: 0.7,
    });

    // User cancelelled action
    if (!result.canceled) {
      setForm(prev => ({ ...prev, imageUri: result.assets[0].uri }));
    }
  };

  /* Kindacode.com, 2022
   Take a photo with the camera */
  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        'You have refused to allow this app to access your camera!',
        'Permission to access the camera is required'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });

    if (!result.canceled) {
      setForm(prev => ({ ...prev, imageUri: result.assets[0].uri }));
    }
  };

  // Lets the user choose between camera and gallery
  const chooseImageSource = () => {
    triggerHaptic();
    Alert.alert('Add Image Evidence', 'How would you like to add an image?', [
      { text: 'Take Photo', onPress: openCamera },
      { text: 'Choose from Gallery', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };


  /*  Hiếu,2022 -Upload image to backend API (Azure blob via the asp.net core) */
  const uploadImageToAzure = async (uri: string): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: 'complaints-image.jpg',
      type: 'image/jpeg',
    } as any);

    try {
     
      const response = await fetch(`${API_BASE_URL}/api/Tickets/upload-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.imageUrl;
      }
    } catch (error) {
      console.error('Image upload failed', error);
    }
    return null;
  };


  // Submit Ticket info to backend 
  const handleSubmit = async () => {
    // if user is not logged in they cannot submit a ticket
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to submit a ticket.');
      return;
    }

    if (form.reasonId === 0) {
      triggerHaptic();
      triggerScreenReader('Please select a reason for reporting');
      Alert.alert('Selection Required', 'Please select a reason for reporting.');
      return;
    }

    if (!value) {
      triggerHaptic();
      triggerScreenReader('Please select an occupied parking bay');
      Alert.alert('Selection Required', 'Please select an occupied parking bay.');
      return;
    }

    setLoading(true);

    let uploadedImageUrl = null;
    if (form.imageUri) {
      uploadedImageUrl = await uploadImageToAzure(form.imageUri);
    }

    const selectedReason = cancellationReasons.find(r => r.id === form.reasonId);

    const payload = {
      reportingUserID: currentUser.uid, // Firebase String UID of person reporting
      userID: "",
      bayID: form.bayId,
      bayNumber: form.parkingBay,
      sectionID: form.sectionId,
      reason: selectedReason?.reason || 'Other',
      description: form.bio,
      imageURL: uploadedImageUrl,
      status: 'Pending',
    };

    try {
      //fetching network if network does not match network API it will give an error alert on the network
      const response = await fetch(`${API_BASE_URL}/api/Tickets`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

      if (response.ok) {
        triggerHaptic();
        triggerScreenReader('Ticket submitted');
        router.push('/success');
      } else {
        Alert.alert('Error', 'Failed to create ticket. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network request failed.');
    } finally {
      setLoading(false);
    }
  };

  //Sanja,2022
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.heading }]}>Create a Ticket</Text>
        <Text style={styles.subtitle}>Report Any parking violation</Text>
      </View>

      <KeyboardAwareScrollView style={styles.form}>
        <Text style={styles.sectionSubtitle}>
          Please select a reason for cancellation
        </Text>
        <View style={styles.cancelReasons}>
          {cancellationReasons.map(item => {
            const isActive = form.reasonId === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  triggerHaptic();
                  setForm({ ...form, reasonId: item.id });
                }}
                style={[
                  styles.cancelReason,
                  { backgroundColor: theme.surface },
                  isActive && { backgroundColor: theme.background },
                ]}>
                <View style={styles.cancelReasonContent}>
                  <Text style={[styles.cancelReasonTitle, { color: theme.heading }]}>{item.reason}</Text>
                  <Text style={[styles.cancelReasonDescription, { color: theme.muted }]}>
                    {item.description}
                  </Text>
                </View>
                <View
                  style={[
                    styles.cancelReasonRadio,
                    !!isActive && {
                      borderColor: '#2C6479ff',
                      borderWidth: 6,
                      backgroundColor: '#fff',
                    },
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Jayasekara, 2025 - Dropdown to select parking bay */}
        <View style={styles.input}>
          <Text style={[styles.sectionSubtitle, { marginBottom: 8 }]}>
            Please select the parking bay at fault
          </Text>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={handleBayChange}
            setItems={setItems}
            placeholder="Select a parking bay"
            listMode="MODAL"
            modalProps={{ animationType: 'slide', statusBarTranslucent: true }}
            modalContentContainerStyle={{
              paddingTop: insets.top + 16,
              backgroundColor: theme.background,
            }}
            theme={colorMode === 'dark' ? 'DARK' : 'LIGHT'}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />
          {items.length === 0 && (
            <Text style={[styles.sectionSubtitle, { marginTop: 8 }]}>
              No occupied bays right now.
            </Text>
          )}
        </View>
        <Text style={styles.sectionTitle}>Description (Optional)</Text>
        <View style={[styles.formInput, { backgroundColor: theme.surface }]}>
          <TextInput
            clearButtonMode="while-editing"
            multiline={true}
            onChangeText={bio => setForm({ ...form, bio })}
            placeholder="Describe parking violation..."
            placeholderTextColor={theme.muted}
            style={[styles.formInputControl, styles.formTextarea, { color: theme.text }]}
            value={form.bio}
          />
        </View>

        <Text style={styles.sectionTitle}>Add Image Evidence (Optional)</Text>
        <TouchableOpacity
          style={[styles.cancelReason, { backgroundColor: theme.surface }]}
          onPress={chooseImageSource}>
          <FeatherIcon name="camera" size={29} color="#6b7280" />
          <Text style={[styles.sectionSubtitle, { marginLeft: 12 }]}>
            {form.imageUri ? 'Image Selected (tap to change)' : 'Take Photo or Upload Image'}
          </Text>
        </TouchableOpacity>

        {form.imageUri && (
          <Image
            source={{ uri: form.imageUri }}
            style={{ width: 100, height: 100, borderRadius: 12, marginVertical: 8 }}
          />
        )}

        <View style={styles.formAction}>
          <TouchableOpacity onPress={handleSubmit} disabled={loading}>
            <View style={styles.btn}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Submit</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    color: '#889797',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#889797',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  /** Header */
  header: {
    paddingHorizontal: 24,
    marginBottom: 28,
    marginTop: 50,
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#daebff',
    marginTop: 50,
    marginBottom: 16,
  },
  /** Form */
  form: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    paddingVertical: 0,
    paddingHorizontal: 24,
  },
  formLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    marginBottom: 6,
  },
  formInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  formInputControl: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    paddingRight: 16,
    paddingLeft: 0,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    paddingVertical: 12,
  },
  formTextarea: {
    paddingTop: 12,
    height: 120,
  },
  formGroup: {
    marginBottom: 24,
  },
  formIcon: {
    paddingLeft: 12,
  },
  formLink: {
    textAlign: 'right',
    fontWeight: '600',
    color: '#1ec3c3',
    textDecorationLine: 'underline',
    textDecorationColor: '#10c08b',
    textDecorationStyle: 'solid',
    position: 'absolute',
    right: 8,
    top: 32,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  formGroupFooter: {
    fontSize: 13,
    lineHeight: 18,
    color: '#889797',
  },
  formAction: {
    marginVertical: 24,
  },
  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 1,
    backgroundColor: "#0c5464",
    borderColor: '#1c895c',
  },
  btnText: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: 'bold',
    color: '#d9ddeb',
  },
  cancelReasons: {
    marginTop: 8,
  },
  cancelReason: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  cancelReasonActive: {
    backgroundColor: '#f3f4f6',
  },
  cancelReasonContent: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  cancelReasonTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1d1d1d',
  },
  cancelReasonDescription: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  cancelReasonRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
  },
  sectionSubtitle: {
    fontSize: 15,
    color: '#6b7280',
  },

  /** Input */
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  inputSelect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    borderWidth: 1,
    borderColor: '#C9D3DB',
    borderStyle: 'solid',
  },
  inputSelectValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
  // Jayasekara, 2025 (dropdown css)
  dropdown: {
    borderColor: '#C9D3DB',
    borderRadius: 12,
  },
  dropdownContainer: {
    borderColor: '#C9D3DB',
  },
});
/**
 * References
 * Adeoye, T.2024. React Hooks: useState (With Practical Examples).(Version 10.0) [Source code]. Available at:< https://medium.com/@titoadeoye/react-hooks-usestate-with-practical-examples-64abd6df6471 > [Accessed 30 Aug. 2026].
 * Hiếu, N.H.2022. react-native: upload image - DEV Community.(Version 10.0) [Source code] Available at:< https://dev.to/hieunh1801/react-native-upload-file-1860 > [Accessed 30 August 2026].
 * Jayasekara, S.S. 2025. How to Add a Dropdown Picker in React Native Expo (iOS & Android Compatible). (Version 10.0) [Source code] Available at:< https://sasandasaumya.medium.com/how-to-add-a-dropdown-picker-in-react-native-expo-ios-android-compatible-4944c66f58c7 > [Accessed 1 Sept. 2026].
 * Kindacode.com.2022. Using Image Picker and Camera in React Native (Expo) - KindaCode. (Version 10.0) [Source code] Available at:< https://www.kindacode.com/article/image-picker-in-react-native > [Accessed 30 Aug. 2026].
 * Sanja.2022. How to upload a photo in React, create a FormData object (with the image file and string data types), send it to the NodeJS server, save it in MongoDB and fetch it from React and render it on a page. (Version 10.0) [Source code] Available at:< https://medium.com/@sanja1mandic/how-to-upload-a-photo-in-react-create-a-formdata-object-with-image-file-and-string-data-types-71e9e08fb53c > [Accessed 1 Sept. 2026].
 * Withfra.me. 2022. Ready to Use React Native Components - WithFrame | withfra.me. (Version 10.0) [Source code] Available at:<https://withfra.me/components > [Accessed 17 August 2026].
 */