const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
//const workSpaceSid = process.env.TWILIO_WORKSPACE_SID;
const offlineActivitySid = process.env.TWILIO_OFFLINE_ACTIVITY_SID;
const client = require('twilio')(accountSid, authToken);

module.exports = async function () {
    // Work out the workspace SID (only supports one workspace presently, foreach for more)
    const allWorkspaces = await client.taskrouter.workspaces.list();
    const workSpaceSid = allWorkspaces[0].sid;

    //Grab the workers from the workspace
    const taskRouterForWorkspace = client.taskrouter.workspaces(workSpaceSid);
    const allWorkers = await taskRouterForWorkspace.workers.list()
    const allWorkersNotOffline = allWorkers
        .filter(x => x.activitySid != offlineActivitySid);

    console.log(`${allWorkersNotOffline.length}/${allWorkers.length} workers not Offline`);

    //Do it (make them offline)
    allWorkersNotOffline.forEach(worker => {
        //await worker.update({ activitySid: offlineActivitySid })
        console.log(`${worker.friendlyName} was ${worker.activityName}, should now be Offline`);
    });


}