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
    
  } catch (e) {
    return jsonError(500, 'Failed to save project', {message: e.message || 'unknown error'});
  }
})