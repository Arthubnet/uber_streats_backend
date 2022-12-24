import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateAccountInput } from './dtos/create-users.dto';
import { LoginInput } from './dtos/login.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput } from './dtos/edit-profile.dto';
import { Verification } from './entities/verification.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    email,
    password,
    role,
    age,
  }: CreateAccountInput): Promise<{ error?: string; ok: boolean }> {
    try {
      const exists = await this.users.findOneBy({ email });

      if (exists) {
        return { error: 'There is a user created already', ok: false };
      }
      const user = await this.users.save(
        this.users.create({ email, password, role, age }),
      );
      await this.verifications.save(this.verifications.create({ user }));
      return { ok: true };
    } catch (error) {
      console.log(error);
      return { error: "Couldn't create an account", ok: false };
    }
  }
  async login({
    email,
    password,
  }: LoginInput): Promise<{ error?: string; ok: boolean; token?: string }> {
    try {
      const user = await this.users.findOneBy({ email });
      if (!user) {
        return { ok: false, error: 'User not found' };
      }
      const checkPassword = await user.checkPassword(password);
      if (!checkPassword) {
        return { ok: false, error: 'The password is incorrect' };
      }
      console.log(user);
      const token = this.jwtService.sign(user.id);
      return { ok: true, token };
    } catch (error) {
      console.log(error);
      return { error, ok: false };
    }
  }

  /* Looking for a user in DB by id */
  async findById(id: number): Promise<User> {
    return this.users.findOneBy({ id });
  }

  async editProfile(
    id: number,
    { email, password }: EditProfileInput,
  ): Promise<User> {
    const user = await this.users.findOneBy({ id });
    if (email) {
      user.email = email;
      user.verified = false;
      await this.verifications.save(this.verifications.create({ user }));
    }
    if (password) {
      user.password = password;
    }
    return this.users.save(user);
  }

  async verifyEmail(code: string): Promise<boolean> {
    //we find the id of the user in verification repository, and related user to this id from user repsitory
    const verification = await this.verifications.find({
      where: { code },
      relations: ['user'],
    });
    if (verification) {
      console.log(verification);
      verification[0].user.verified = true;
      this.users.save(verification[0].user);
    }
    return false;
  }
}
