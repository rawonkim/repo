from flask import request, jsonify
from flask_smorest import Blueprint
from flask.views import MethodView
from .db import db
from models import User

user_blp = Blueprint("Users", "users", description="Operations on users", url_prefix='/user')

@user_blp.route('/')
class UserList(MethodView):
    def get(self):
        users = User.query.all()
        user_data = [{"id":user.id, "name": user.name, "email": user.email} for user in users]  # Convert to list
        return jsonify(user_data)
    
    def post(self):
        print("요청은 오는가?")
        user_data = request.json
        new_user = User(name=user_data['name'], email=user_data['email'])
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "Successfully created new user"}), 201
    
@user_blp.route('/<int:user_id>')
class UserResource(MethodView):
    def get(self, user_id):
        user = User.query.get_or_404(user_id)
        print(type(user))

        return {"name": user.name, 'email': user.email}
    
    def put(self, user_id):
        user = User.query.get_or_404(user_id)
        user_data = request.json

        user.name = user_data['name']
        user.email = user_data['email']

        db.session.commit()

        return jsonify({"message": "Successfully updated user"})
    
    def delete(self, user_id):
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return {"message": "Successfully deleted user"}