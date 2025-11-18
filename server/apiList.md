# Devtinder API

# AuthRouter
- POST auth/signup
- POST auth/login
- POST auth/logout

# ProfileRouter
- GET /profile
- PATCH /profile/edit
- PATCH /profile/password

# ConnectionRequestRouter
- STATUS:
- Profile: Interested, Ignore
- Connection: Accept, Reject

- POST /request/send/interested/:userId
- POST /request/review/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

# UserRouters
- GET user/connections
- GET user/requests
- GET user/feed - Gets you the profiles of other users on plateform

