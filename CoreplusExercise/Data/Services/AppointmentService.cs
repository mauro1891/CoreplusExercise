using System.Collections.Generic;
using System.Linq;

namespace CoreplusExercise.Data
{
    public class AppointmentService : IAppointmentService
    {
        public List<Appointment> GetAllAppointments() => DataAppointment.Appointments.ToList();
    }
}
