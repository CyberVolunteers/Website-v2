db = db.getSiblingDB("<database name>");

db.createUser({
	user: "<normal user username>",
	pwd: "<normal user password>",
	roles: [
		{
			role: "<readWrite>",
			db: "<database name>",
		},
	],
});
