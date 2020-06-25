const accountSid =  process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const workSpaceSid = process.env.TWILIO_WORKSPACE_SID;
const offlineActivitySid = process.env.TWILIO_OFFLINE_ACTIVITY_SID;
const client = require('twilio')(accountSid, authToken);

module.exports = async function () {

    const allNotOfflineWorkers = (await client.taskrouter.workspaces(workSpaceSid)
        .workers
        .list())
        .filter(x => x.activitySid != offlineActivitySid);

    console.log(`${allNotOfflineWorkers.length} workers not Offline`);

    allNotOfflineWorkers.forEach(worker => {
        worker.update({ activitySid: offlineActivitySid })
        console.log(`${worker.friendlyName} was ${worker.activityName}, should now be Offline`);
    });


}