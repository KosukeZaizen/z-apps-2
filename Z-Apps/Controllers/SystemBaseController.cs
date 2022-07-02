using Microsoft.AspNetCore.Mvc;
using Z_Apps.Models;
using Z_Apps.Models.SystemBase;
using System.Collections.Generic;
using System.Threading.Tasks;
using Z_Apps.Util;

namespace Z_Apps.Controllers
{
    [Route("api/[controller]")]
    public class SystemBaseController : Controller
    {
        private ClientLogService clientLogService;
        private VersionService versionService;
        public SystemBaseController(DBCon con)
        {
            clientLogService = new ClientLogService(con);
            versionService = new VersionService();
        }

        [HttpGet("[action]")]
        public IEnumerable<ClientOpeLog> GetOpeLogs()
        {
            return clientLogService.GetOpeLogs();
        }

        [HttpGet("[action]")]
        public IEnumerable<Client> GetAllClients()
        {
            return clientLogService.GetAllClients();
        }

        [HttpPost("[action]")]
        public void RegisterLog([FromBody] ClientOpeLog log)
        {
            clientLogService.RegisterLog(log);
        }

        [HttpGet("[action]/{dummyParam?}")]
        public async Task<string> GetVersion()
        {
            return await versionService.GetVersion(HttpContext);
        }

        [HttpGet("[action]")]
        public Dictionary<
            string,
            Dictionary<
                string,
                Dictionary<
                    string,
                    ApiCache.CacheData
                >
            >
        > GetCache()
        {
            return ApiCache.GetCache();
        }

        [HttpPost("[action]")]
        public IActionResult GetAbTestKey([FromBody] GetAbTestKeyParam param)
        {
            return Ok(new
            {
                key = ApiCache.UseCache(
                    param.TestName,
                    () => new AbTestService().GetAbTestKey(param)
                )
            });
        }
        public class GetAbTestKeyParam
        {
            public string TestName { get; set; }
            public string[] Keys { get; set; }
        }

        [HttpPost("[action]")]
        public IActionResult AbTestSuccess([FromBody] AbTestSuccessParam param)
        {
            new AbTestService().AbTestSuccess(param);
            return Ok(new
            {
                message = "success"
            });
        }
        public class AbTestSuccessParam
        {
            public string TestName { get; set; }
            public string Key { get; set; }
        }

        [HttpGet("[action]")]
        public IActionResult GetAllTestName()
        {
            return Ok(new
            {
                testNames = new AbTestService().GetAllTestName()
            });
        }

        [HttpGet("[action]")]
        public IActionResult GetTestRecordsWithDate(string testName)
        {
            return Ok(new
            {
                records = new AbTestService().GetTestRecordsWithDate(testName)
            });
        }
    }
}