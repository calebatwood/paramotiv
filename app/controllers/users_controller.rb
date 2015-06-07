class UsersController < ApplicationController

  def index
    @users = User.all
    @user = User.new
    @car = Car.new
    @cars = current_user.cars
  end

  def new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      redirect_to user_path(@user)
    else
      render :new
    end
  end

  def show
    @user = User.find(params[:id])
    @cars = @user.cars
    @car = Car.new
  end

  def edit
    @user = User.find(params[:id])
  end

  def update
    @user = User.find(params[:id])
    if @user.update(user_params)
      redirect_to user_path(@user)
    else
      render :edit
    end
  end

  def destroy

  end

  private

  def user_params
    params.require(:user).permit(:first_name, :last_name, :username, :password, :password_confirmation, :avatar, :role, :zip_code)
  end

end
