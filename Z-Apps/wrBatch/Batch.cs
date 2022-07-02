using System;
using System.Threading.Tasks;
using Z_Apps.Models;
using Z_Apps.Models.SystemBase;
using Z_Apps.Util;

namespace Z_Apps.wrBatch
{
    public class Batch
    {
        public static async void runAsync()
        {
            while (true)
            {
                try
                {
                    var t = Task.Run(() =>
                    {
                        var dt = DateTime.Now;

                        // Weekly
                        if (dt.DayOfWeek == DayOfWeek.Saturday)
                        {
                            // Saturday
                            switch (dt.Hour)
                            {
                                case 8:
                                    // 8:00 - 8:59 (17:00 - 17:59 JST)
                                    SortFolktales();
                                    break;
                                case 9:
                                    // 9:00 - 9:59 (18:00 - 18:59 JST)
                                    DeleteOpeLogs();
                                    break;
                                case 10:
                                    // 10:00 - 10:59 (19:00 - 19:59 JST)
                                    MakeDbBackupAsync();
                                    break;
                                case 11:
                                    // 11:00 - 11:59 (20:00 - 20:59 JST)
                                    ApiCache.DeleteOldCache();
                                    break;
                            }
                        }
                    });

                    await Task.Delay(1000 * 60 * 60); // Wait for 1 hour
                }
                catch (Exception ex)
                {
                    ErrorLog.InsertErrorLog(ex.ToString());
                }
            }
        }

        private static async void MakeDbBackupAsync()
        {
            var con = new DBCon();
            var logService = new ClientLogService(con);

            var storageBkService = new StorageBackupService(con);
            await storageBkService.MakeBackup();

            logService.RegisterLog(new ClientOpeLog()
            {
                url = "wrBatch",
                operationName = "finish to make DB backup",
                userId = "wrBatch"
            });
        }

        private static void DeleteOpeLogs()
        {
            var con = new DBCon();
            var service = new ClientOpeLogManager(con);
            service.DeleteOldLogs();
            service.DeleteAdminLogs();
        }

        private static void SortFolktales()
        {
            var con = new DBCon();
            var service = new ClientOpeLogManager(con);
            service.SortFolktales();
        }
    }
}