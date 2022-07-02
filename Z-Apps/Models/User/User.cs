using System.Linq;
using System;
using System.Text.Json.Serialization;

namespace Z_Apps.Models
{
    public class User
    {
        public int UserId
        {
            get; set;
        }
        public string Name
        {
            get; set;
        }
        public string Email
        {
            get; set;
        }
        [JsonIgnore]
        public string Password
        {
            get; set;
        }
        public string Progress
        {
            get; set;
        }
        public long Exp
        {
            get; set;
        }
        public int Level
        {
            get
            {
                return UserService.GetLevelFromExp(Exp);
            }
        }
    }
}