const PROJECT_PREFIX = 'roomify_project_';

const jsonError= (status, message, extra ={}) =>{
  new Response(JSON.stringify({error: message, ...extra}),{
    status,
    headers:{
      'Content-Types': 'application/json',
      'Access-Control-Allow-Origin' : '*'
    }
  })
}

const getUserId = async (userPuter) => {
    try {
        const user = await userPuter.auth.getUser();

        return user?.uuid || null;
    } catch {
        return null;
    }
}
router.post('/api/projects/save', async({request, user})=>{
  try {
     const userPuter = user.puter;

        if(!userPuter) return jsonError(401, 'Authentication failed');

        const body = await request.json();
        const project = body?.project;

        if(!project?.id || !project?.sourceImage) return jsonError(400, 'Project ID and source image are required');

        const payload = {
            ...project,
            updatedAt: new Date().toISOString(),
        }

        const userId = await getUserId(userPuter);
        if(!userId) return jsonError(401, 'Authentication failed');

        const key = `${PROJECT_PREFIX}${project.id}`;
        await userPuter.kv.set(key, payload);

        return { saved: true, id: project.id, project: payload }

  } catch (e) {
    return jsonError(500, 'Failed to save project', {message: e.message || 'unknown error'});
  }
})