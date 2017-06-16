using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OATest.Models
{
    /// <summary>
    /// Result Object
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class ResponseObject
    {
        /// <summary>
        /// operation status
        /// </summary>
        public int Status { get; set; }

        /// <summary>
        /// message of status
        /// </summary>
        public string Message { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ResponseObject"/> class.
        /// </summary>
        public ResponseObject()
        {
            Status = 0;
        }
    }
}