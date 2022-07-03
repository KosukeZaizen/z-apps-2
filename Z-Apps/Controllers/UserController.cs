using Microsoft.AspNetCore.Mvc;
using Z_Apps.Models;
using static Z_Apps.Models.UserService;

namespace Z_Apps.Controllers
{
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        UserService userService;

        public UserController()
        {
            userService = new UserService();
        }

        [HttpGet("[action]/")]
        public XpProgress GetXpProgress(long exp)
        {
            return userService.GetXpProgress(exp);
        }
    }
}