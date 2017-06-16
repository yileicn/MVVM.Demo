using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OATest.Models
{
    public class PagingRequestObject<T>
    {
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public string OrderBy { get; set; }
        public T Query { get; set; }
    }
}