class CarsController < ApplicationController

  def index
    @user = current_user
    @cars = @user.cars
    @car = Car.new
  end

  def new

  end

  def create
    @user = current_user
    @car = Car.new(car_params)
    @car.user_id = current_user.id
    if @car.save
      redirect_to root_path
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
    @car = current_user.cars.find(params[:id])
    @car.destroy
    render nothing: true
  end

  private

  def car_params
    params.require(:car).permit(:make, :model, :year, :style, :style_id, :zip, :model_year_id, :user_id, :mileage)
  end

end
