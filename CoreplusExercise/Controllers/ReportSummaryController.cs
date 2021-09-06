using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using CoreplusExercise.Data;
using Microsoft.AspNetCore.Mvc;

namespace ReportSummary.Controllers
{
    [Route("api/[controller]")]
    public class ReportSummaryController : Controller
    {
        private IPractitionerService _practitionerService;
        private IAppointmentService _appointmentService;
        public ReportSummaryController(IPractitionerService practitionerService, IAppointmentService appointmentService)
        {
            this._appointmentService = appointmentService;
            this._practitionerService = practitionerService;
        }

        [HttpGet("[action]")]
        public IActionResult GetPractitioners()
        {
            try
            {
                var allPractitioners = _practitionerService.GetAllPractitioners();
                return Ok(allPractitioners);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("[action]")]
        public IActionResult GetPractitionersSummary([FromQuery(Name = "practitionerIds")] int[] practitionerIds, [FromQuery(Name = "startDate")] string startDate, [FromQuery(Name = "endDate")] string endDate)
        {
            try
            {
                List<Practitioner> practitioners = _practitionerService.GetAllPractitioners();
                List<Appointment> appointments = _appointmentService.GetAllAppointments();

                List<Appointment> appointmentsFiltered = appointments.Where(x => practitionerIds.Any(y => y == x.Practitioner_Id)
                && x.Date > DateTime.ParseExact(startDate, "yyyy-MM-dd", CultureInfo.CurrentCulture)
                && x.Date < DateTime.ParseExact(endDate, "yyyy-MM-dd", CultureInfo.CurrentCulture)).ToList();

                List<PractitionerSummary> practitionersSummary = appointmentsFiltered.GroupBy(r => new { r.Practitioner_Id, r.Date.Year, r.Date.Month }).Select((g, index) => new PractitionerSummary()
                {
                    PractitionerId = g.Key.Practitioner_Id,
                    Name = practitioners.Where(z => z.Id.Equals(g.Key.Practitioner_Id)).First().Name,
                    Id = index + 1,
                    Cost = g.Sum(c => c.Cost),
                    Revenue = g.Sum(r => r.Revenue),
                    MonthDate = new DateTime(g.Key.Year, g.Key.Month, 1)
                }).OrderBy(o => o.Name).ThenByDescending(o => o.MonthDate).ToList();

                return Ok(practitionersSummary);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
        [HttpGet("[action]")]
        public IActionResult GetAppointmentByPractitionerIdAndDate(int practitionerId, [FromQuery(Name = "Date")] string Date)
        {
            try
            {
                DateTime dateAppointment = DateTime.ParseExact(Date, "yyyy-MM-dd", CultureInfo.CurrentCulture);
                DateTime firstDate = new DateTime(dateAppointment.Year, dateAppointment.Month, 1);
                DateTime lastDate = firstDate.AddMonths(1).AddDays(-1);

                List<Appointment> appointments = _appointmentService.GetAllAppointments();

                List<Appointment> appointmentsFiltered = appointments.Where(x => practitionerId == x.Practitioner_Id
                && x.Date > firstDate
                && x.Date < lastDate).OrderByDescending(a => a.Date).ToList();

                return Ok(appointmentsFiltered);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
    }
}