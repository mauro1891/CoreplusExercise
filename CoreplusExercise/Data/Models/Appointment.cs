using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreplusExercise.Data
{
    public class Appointment
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Client_Name { get; set; }
        public string Appointment_Type { get; set; }
        public int Duration { get; set; }
        public int Revenue { get; set; }
        public int Cost { get; set; }
        public int Practitioner_Id { get; set; }
    }
}
