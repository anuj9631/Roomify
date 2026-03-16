const jsonError= (status, message, extra ={}) =>{
  new Response(JSON.stringify({error: message, ...extra}),{
    status,
    headers:{
      'Content-Types': 'application/json',
      'Access-Control-Allow-Origin' : '*'
    }
  })
}

router.post('/api/projects/save', async({request, response})=>{
  try {
    
  } catch (e) {
    return jsonError(500, 'Failed to save project', {message: e.message || 'unknown error'});
  }
})