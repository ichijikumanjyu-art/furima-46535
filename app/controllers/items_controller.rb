class ItemsController < ApplicationController
  before_action :authenticate_user!, only: [:new]

  def index
    @items = Item.order(created_at: :desc)
  end

  def new
    @user = User.new
    @item = Item.new
  end

  def create
    @item = Item.new(item_params)
    @item.user = current_user # ログインユーザーと紐づけ

    if @item.save
      redirect_to root_path, notice: '商品を出品しました'
    else
      render :new, status: :unprocessable_entity
    end
  end

  def show
    @item = Item.find(params[:id])
  end
  
  private

  def item_params
    params.require(:item).permit(
      :product,
      :introduce,
      :price,
      :category_id,
      :condition_id,
      :shipping_cost_id,
      :prefecture_id,
      :shipping_date_id,
      :image
    ).merge(user_id: current_user.id)
  end
end
