using Microsoft.AspNetCore.Mvc;
using Z_Apps.Models;
using Z_Apps.Models.Auth;
using Z_Apps.Models.SystemBase;

namespace Z_Apps.Controllers
{
    [Route("api/[controller]")]
    public class _LNBaseController : Controller
    {
        protected UserService userService;
        protected JwtService jwtService;

        public _LNBaseController(StorageService storageService)
        {
            userService = new UserService(storageService);
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