using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Z_Apps.Models;
using Z_Apps.Models.Auth;

namespace Z_Apps.Controllers
{
    [Route("api/[controller]")]
    public class _LNBaseController : Controller
    {
        protected UserService userService;
        protected JwtService jwtService;

        public _LNBaseController()
        {
            userService = new UserService();
            jwtService = new JwtService();
        }


        protected int GetUserIdFromCookies()
        {
            var jwt = Request.Cookies["jwt"];
            var token = jwtService.Verify(jwt);
            return int.Parse(token.Issuer);
        }

        protected User GetUserFromCookies()
        {
            int userId = GetUserIdFromCookies();
            return userService.GetUserById(userId);
        }
    }
}