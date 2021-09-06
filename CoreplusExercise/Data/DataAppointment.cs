using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace CoreplusExercise.Data
{
    public class DataAppointment
    {
        public static List<Appointment> Appointments => allAppointments();
        static List<Appointment> allAppointments()
        {
            var appDomain = System.AppDomain.CurrentDomain;
            var basePath = appDomain.RelativeSearchPath ?? appDomain.BaseDirectory;
            basePath = Path.Combine(basePath, "Data", "appointments.json");

            var data = File.ReadAllText(basePath);
            var Appointments = JsonConvert.DeserializeObject<List<Appointment>>(data);
            return Appointments;
        }
    }

}
