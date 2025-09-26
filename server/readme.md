mern-user-admin/
├── models/          # Database models (e.g., User schema)
│   └── User.js
├── routes/          # API routes (endpoints)
│   └── users.js
├── middleware/      # Custom functions (e.g., auth checks)
│   └── auth.js
├── .env             # Environment variables (don't commit to Git!)
├── server.js        # Main server file
└── package.json    


## Front end 

client/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   └── Login.js
│   │   ├── Admin/
│   │   │   ├── UserTable.js
│   │   │   ├── UserModal.js
│   │   │   └── UserActions.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── App.js
│   ├── index.js
│   ├── index.css
│   └── ...
├── public/
├── package.json
└── ...