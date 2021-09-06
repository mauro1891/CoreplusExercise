using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace CoreplusExercise.Data
{
    public class PractitionerSummary
    {
        public int Id { get; set; }
        public int PractitionerId { get; set; }
        public string Name { get; set; }
        public float Cost { get; set; }
        public float Revenue { get; set; }
        public DateTime MonthDate { get; set; }
        public string MonthYear
        {
            get
            {
                return string.Concat(CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(MonthDate.Month), " ", MonthDate.Year);
            }
        }
    }
}
