using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace CoreplusExercise.Data
{
    public class DataPractitioner
    {
        public static List<Practitioner> Practitioners => allPractitioners();
        static List<Practitioner> allPractitioners()
        {
            var appDomain = System.AppDomain.CurrentDomain;
            var basePath = appDomain.RelativeSearchPath ?? appDomain.BaseDirectory;
            basePath = Path.Combine(basePath, "Data", "practitioners.json");

            var data = File.ReadAllText(basePath);
            var practitioners = JsonConvert.DeserializeObject<List<Practitioner>>(data);
            return practitioners;
        }
    }

}
