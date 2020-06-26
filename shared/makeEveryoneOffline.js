const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
//const workSpaceSid = process.env.TWILIO_WORKSPACE_SID;
const offlineActivitySid = process.env.TWILIO_OFFLINE_ACTIVITY_SID;
const client = require('twilio')(accountSid, authToken);

module.exports = async function () {
    // Work out the workspace SID (only supports one workspace presently, foreach for more)
    const allWorkspaces = await client.taskrouter.workspaces.list();
    const workSpaceSid = allWorkspaces[0].sid;

    // Grab the workers from the workspace
    const taskRouterForWorkspace = client.taskrouter.workspaces(workSpaceSid);
    const allWorkers = await taskRouterForWorkspace.workers.list()
    const allWorkersNotOffline = allWorkers
        .filter(x => x.activitySid != offlineActivitySid);

    console.log(`${allWorkersNotOffline.length}/${allWorkers.length} workers not Offline`);

    // Do it (make them offline)
    await allWorkersNotOffline.forEach(async (worker) => {
        const reses = await worker.reservations().list();
        const acceptedReses = reses.filter(x => x.reservationStatus == "accepted");

        if (acceptedReses.length < 1) {
            const oldactivityName = worker.activityName;
            await worker.update({ activitySid: offlineActivitySid });
            console.log(`${worker.friendlyName} was ${oldactivityName}, setting to Offline.`);
        }
        else { //Do not offline those in the middle of a call/ chat
            console.log(`${worker.friendlyName} still has an accepted reservation! Leaving them as ${worker.activityName}.`);
        }
    });


}