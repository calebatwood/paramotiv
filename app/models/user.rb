class User < ActiveRecord::Base
  has_secure_password
  enum role: {user: 0, admin: 1}
  mount_uploader :avatar, AvatarUploader
  
  def full_name
    "#{first_name} #{last_name}"
  end

  def admin
    admin?
  end

  def admin=(role)
    if role
      self.role = User.roles[:admin]
    else
      self.role = User.roles[:user]
    end
  end

end
