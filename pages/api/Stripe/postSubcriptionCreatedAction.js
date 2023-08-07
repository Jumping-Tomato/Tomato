

export default async function postSubcriptionCreatedAction(request, response) {
    const event = request.body;
    console.log(event)
    response.send(200);
  }