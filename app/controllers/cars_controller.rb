class CarsController < ApplicationController

  def index
    @user = current_user
    @cars = Car.all
  end

  def new
    @user = current_user
    @car = Car.new
  end

  def create
    @user = current_user
    @car = Car.new(car_params)
    @car.user_id = current_user.id
    if @car.save
      redirect_to user_cars_path(current_user)
    else
      render :new
    end
  end

  def show

  end

  def edit

  end

  def update

  end

  def destroy
    @user = User.find(params[:id])
    @car = Car.find(params[:id])
    @car.destroy
      redirect_to user_cars_path(current_user)
  end

  private

  def car_params
    params.require(:car).permit(:make, :model, :year, :style, :style_id, :zip, :model_year_id, :user_id)
  end

end
