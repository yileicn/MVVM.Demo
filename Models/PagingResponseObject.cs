using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OATest.Models
{
    public class PagingResponseObject<T> : ResponseObject
    {
        public int PageSize { get; set; }
        public int PageIndex { get; set; }
        public int Total { get; set; }
        public int TotalPage { get; set; }
        public List<T> Items { get; set; }

        /// <summary>
        /// 初始化PAGE 对象，计算总页数
        /// </summary>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <param name="totalCount"></param>
        public void Init(int pageIndex, int pageSize, int totalCount)
        {
            this.PageIndex = pageIndex;
            this.PageSize = pageSize;
            this.Total = totalCount;

            if (pageSize != 0)
            {
                this.TotalPage = totalCount / pageSize;
                if (totalCount % pageSize > 0)
                    TotalPage++;
            }
        }
    }
}