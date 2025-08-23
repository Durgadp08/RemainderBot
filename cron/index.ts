import { CronJob } from "cron";

const job = new CronJob(
  "* * * * * *",
  function () {
    console.log("Heii");
  },
  null,
  true,
  "America/Los_Angeles"
);

job.start();
