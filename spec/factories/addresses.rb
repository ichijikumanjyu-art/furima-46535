FactoryBot.define do
  factory :address do
    post_code { "MyString" }
    prefecture_id { 1 }
    city { "MyString" }
    street { "MyString" }
    building { "MyString" }
    phone_number { "MyString" }
    order { nil }
  end
end
