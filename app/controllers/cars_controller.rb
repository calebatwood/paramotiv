class CarsController < ApplicationController

  def index
    @cars = Car.all
  end

  def new
    @car = Car.new
  end

  def create
    @car = Car.new(car_params)
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

  end

  private

  def car_params
    params.require(:car).permit(:make, :model, :year, :style, :style_id)
  end

end
