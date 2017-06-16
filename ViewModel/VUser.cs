using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OATest.ViewModel
{
    public class VUser
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public eSex Sex { get; set; }
        public string Profession { get; set; }
    }

    public enum eSex {
        Male=0,
        Female=1
    }
}