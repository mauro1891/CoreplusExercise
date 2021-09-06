using System.Collections.Generic;
using System.Linq;

namespace CoreplusExercise.Data
{
    public class PractitionerService : IPractitionerService
    {
        public List<Practitioner> GetAllPractitioners() => DataPractitioner.Practitioners.OrderBy(p => p.Name).ToList();
    }
}
