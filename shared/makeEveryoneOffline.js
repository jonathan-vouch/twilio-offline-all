const accountSid = 'AC472987643d4f4e38cce21f0efae0b008';
const authToken = process.env.TWILIO_AUTH_TOKEN;
const workSpaceSid = 'WS92827f96fd99b691273fef2fb9c7bf6c';
const offlineActivitySid = 'WA4508c5589db4e49678c1cc167baa8ca3';
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