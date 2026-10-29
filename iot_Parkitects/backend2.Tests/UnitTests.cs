using System.Net;
using System.Net.Http.Json;
using Xunit;
using Microsoft.AspNetCore.Mvc.Testing;
using backend2.Models;

namespace backend2.Tests
{
    //(Llamas, 2026)
    //We implement IClassFixture so the API is started once
    public class UnitTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;

        public UnitTests(WebApplicationFactory<Program> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        //test to get all tickets that will appear on web app
        public async Task getTicketsTest()
        {
            //(Llamas, 2026)
            // Act — calling the endpoint linked to azure DB to get tickets
            var response = await _client.GetAsync("/api/Tickets");

            // Assert
            response.EnsureSuccessStatusCode(); // checking the DB
            Assert.Equal("application/json; charset=utf-8", response.Content.Headers.ContentType!.ToString());

            var tickets = await response.Content.ReadFromJsonAsync<List<Ticket>>();
            Assert.NotNull(tickets); //tickets are read from JSOn to be read in list form
        }

        [Fact]
        //test to find a specific ticket with ticket id
        public async Task getTicketByIdTest()
        {
            //(Llamas, 2026)
            // Act - get ticket no 10 from DB- that what I want to find
            var response = await _client.GetAsync("/api/Tickets/10");//gets ticket no.10 info

            // Assert —checks if ticket 10 is in the database
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        //     [Fact]
        //     //tests the creation of a ticket in the mobile app
        //     public async Task createTicketTest()
        //     {
        //         //(Til, Costello and Nelson, 2026)
        //         // Arrange — a bay number that should never realistically have an active session
        //         var newTicket = new Ticket
        //         {
        //             bayID = "A1",
        //             bayNumber = "A1",
        //             sectionID = "A-Block",
        //             reason = "Restricted parking"
        //         };

        //         // Act - should create a new ticket in Tickets enpoint
        //         var response = await _client.PostAsJsonAsync("/api/Tickets", newTicket);

        //         //(Casal, 2023)
        //         // Assert - actually creates ticket to get success 201 created
        //         Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        //         var created = await response.Content.ReadFromJsonAsync<Ticket>();
        //         Assert.NotNull(created);

        //         //(Microsoft learn, 2026)
        //         //deletes the test ticket from the DB
        //         var deleteResponse = await _client.DeleteAsync($"/api/Tickets/{created!.ticketID}");
        //         Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);        }
    }
}

/*
 * References
 *
 * Casal, J., 2023. ASP.NET Core Integration Testing Tutorial. (Version 10.0) [Source Code]. Available at: < https://youtu.be/RXSPCIrrjHc?si=7NAUr9YGr1sz2Zzy > [Accessed  October 2026]
 * Llamas, L, 2026. Integration Testing in ASP.NET Core. (Version 10.0) [Source Code]. Available at: < https://www.luisllamas.es/en/aspnet-core-integration-testing-webapplicationfactory/ > [Accessed 5 October 2026]
 * Microsoft learn, 2026. HttpClient.DeletAsync Method.(Version 10.0) [Source Code]. Available at: < https://learn.microsoft.com/en-us/dotnet/api/system.net.http.httpclient.deleteasync?view=net-10.0 > [Accessed 5 October 2026]
 * Til, J., Costello, M., and Nelson, C., 2026. Integration test in ASP.NET Core. (Version 10.0) [Source Code]. Available at: < https://learn.microsoft.com/en-us/aspnet/core/test/integration-tests?view=aspnetcore-10.0 > [Accessed 5 October 2026]
 */