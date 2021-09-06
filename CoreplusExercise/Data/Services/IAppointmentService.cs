using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreplusExercise.Data
{
    public interface IAppointmentService
    {
        List<Appointment> GetAllAppointments();
    }
}
