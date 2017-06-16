using OATest.Models;
using OATest.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Web;
using System.Web.Mvc;

namespace OATest.Controllers
{
    public class UserController : Controller
    {
        public static List<VUser> glist;
        public ActionResult KOIndex()
        {
            return View();
        }
        public ActionResult VueIndex()
        {
            return View();
        }

        private List<VUser> GetData()
        {
            if (glist != null) return glist;
            glist = new List<VUser>();
            for (int i = 1; i <= 100; i++)
            {
                eSex sex = i%2==0 ? eSex.Male:eSex.Female;
                glist.Add(new VUser() { Id = i, Name = "yilei"+i.ToString(),Sex= sex, Profession = "软件开发工程师" + i.ToString() });
            }
            return glist;
        }

        private IQueryable<T> DataSorting<T>(IQueryable<T> source, string orderby)
        {
            string[] sort = orderby.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
            if (sort.Length != 2) return source;
            string sortExpression = sort[0];
            string sortDirection = sort[1];
            string sortingDir = string.Empty;
            if (sortDirection.ToUpper().Trim() == "ASC")
                sortingDir = "OrderBy";
            else if (sortDirection.ToUpper().Trim() == "DESC")
                sortingDir = "OrderByDescending";
            ParameterExpression param = Expression.Parameter(typeof(T), sortExpression);
            PropertyInfo pi = typeof(T).GetProperty(sortExpression, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
            if (pi == null) return source;
            Type[] types = new Type[2];
            types[0] = typeof(T);
            types[1] = pi.PropertyType;
            Expression expr = Expression.Call(typeof(Queryable), sortingDir, types, source.Expression, Expression.Lambda(Expression.Property(param, sortExpression), param));
            IQueryable<T> query = source.AsQueryable().Provider.CreateQuery<T>(expr);
            return query;
        }

        public JsonResult Get(int id) {
            List<VUser> list = GetData();
            return Json(list.Where(p=>p.Id==id).FirstOrDefault(),JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetList(PagingRequestObject<VUser> req) {
            List<VUser> list = GetData();
            if (!string.IsNullOrWhiteSpace(req.Query.Name)) {
                list = list.Where(p => p.Name == req.Query.Name).ToList();
            }
            if (!string.IsNullOrWhiteSpace(req.Query.Profession))
            {
                list = list.Where(p => p.Profession == req.Query.Profession).ToList();
            }
            if (!string.IsNullOrEmpty(req.OrderBy)) {
                list = DataSorting(list.AsQueryable(), req.OrderBy).ToList();
            }
            PagingResponseObject<VUser> pager = new PagingResponseObject<VUser>();

            pager.Items = list.Skip((req.PageIndex-1)* req.PageSize).Take(req.PageSize).ToList();
            pager.Init(req.PageIndex, req.PageSize, list.Count);
            return Json(pager, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Del(int id) {
            List<VUser> list = GetData();
            VUser user =list.Where(p => p.Id == id).First();
            ResponseObject resp = new ResponseObject();
            if (user == null)
            {
                resp.Status = -1;
            }
            else {
                list.Remove(user);
            }
            return Json(resp);
        }

        public JsonResult Save(VUser model) {
            ResponseObject resp = new ResponseObject();
            List<VUser> list = GetData();
            if (model.Id == 0)//新增
            {
                model.Id = list.Max(p => p.Id) + 1;
                list.Add(model);
            }
            else {
                VUser user = list.Where(p => p.Id == model.Id).First();
                if (user != null) {
                    user.Name = model.Name;
                    user.Sex = model.Sex;
                    user.Profession = model.Profession;
                }
            }            
            return Json(resp);
        }
    }
}