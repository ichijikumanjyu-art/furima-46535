class ItemsController < ApplicationController
  before_action :authenticate_user!, only: [:new, :edit, :update, :destroy]
  before_action :set_item, only: [:edit, :update, :show, :destroy]
  before_action :redirect_unless_editable, only: [:edit, :update, :destroy]

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
  end

  def edit
  end
  
  def update
    if @item.update(item_params)
      redirect_to item_path(@item)
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @item.destroy
    redirect_to root_path
  end

  private

  def set_item
    @item = Item.find(params[:id])
  end


  def redirect_unless_editable
    redirect_to root_path unless current_user == @item.user
  end

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
