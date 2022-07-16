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
        public long Xp
        {
            get; set;
        }
        public int Level
        {
            get
            {
                return UserService.GetLevelFromXp(Xp);
            }
        }
        public string AvatarPath
        {
            get; set;
        }
        private string _Bio;
        public string Bio
        {
            get
            {
                if (_Bio == null || _Bio == "")
                {
                    return @$"Hello! I'm **{Name}**! Nice to meet you!

I hope we can be friends!";
                }
                return _Bio;
            }
            set
            {
                _Bio = value;
            }
        }
    }
}