import { UsersController } from "@dynamic-modules/controllers/users";
import { UsersEntity } from "@dynamic-modules/entities/users";
import { hash, genSalt, compare } from 'bcrypt';
import { promisify } from 'util';
import { Model, OutputData, QueryFields, UpdateData } from "types/entity";
import { SessionController } from "./SessionController";

const SALT_ROUNDS = 12;
const compareAsync = promisify(compare);

export class AuthController extends UsersController {

    private session: SessionController

    constructor() {
        super();
        this.session = new SessionController()
    }
    /**
     * Generates a hash for the given password.
     * @param password The password to hash.
     * @returns The hashed password.
     */
    private async generateHash(
      password: string
    ): Promise<string> {

        const salt = await genSalt(SALT_ROUNDS);
        const passwordHash = await hash(password, salt);
        return passwordHash;

    }
    /**
     * Gets a user entity by email.
     * @param email The email of the user.
     * @returns The user entity or null if not found.
     */
  private async getEntityByEmail(
    email: string
  ): Promise<OutputData<UsersEntity> | null> {

    const options = {
      where: { "email": email },
    } as QueryFields<UsersEntity>

    const [userData] = await this.findByEntity(options);
    if (!userData) {
      return null;
    }
    return userData;
  }
  /**
   * Verifies the user's password against the stored hash.
   * @param email The email of the user.
   * @param password The password to verify.
   * @returns The user entity if the password is correct, otherwise null.
   */
  private async verifyUserPassword(
    email: string, 
    password: string
  ): Promise<OutputData<UsersEntity> | null> {

    const user = await this.getEntityByEmail(email);
    if(user && await this.comparePassword(password, user?.password)){
      return user
    }
    return null;
  }
    /** * Compares the provided password with the stored password hash.
   * @param password The password to compare.
   * @param passwordHash The stored password hash.
   * @returns True if the passwords match, otherwise false.
   */
  private async comparePassword(
    password: string, 
    passwordHash: string = '123'
  ): Promise<boolean> {

    const match = await compareAsync(password, passwordHash);
    await new Promise(resolve => setTimeout(resolve, 100));
    return match

  }
  /**
   * Validates the user's password.
   * @param user The user entity to validate.
   * @param password The password to validate.
   * @returns True if the password is valid, otherwise false.
   */
  public async validatePassword(
    user: OutputData<UsersEntity>,
    password: string
  ): Promise<boolean> {
    const match = await this.comparePassword(password, user.password);
    return match;

  }
  /**
   * Updates the user's password.
   * @param user The user entity to update.
   * @param newPassword The new password to set.
   * @returns A promise that resolves when the password is updated.
   */
  public async updatePassword(
    user: OutputData<UsersEntity>, 
    newPassword: string
  ): Promise<void> {

    const passwordHash = await this.generateHash(newPassword);
    if(user.id){
      const options = {
        fields: ['login' as (keyof Model<UsersEntity>)],
      } as QueryFields<UsersEntity>
      try {
        await this.updateEntity(user.id, { password: passwordHash } as UpdateData<UsersEntity>, options);
      } catch (error) {
        let errorMessage = 'Error updating password';
        if(error instanceof Error) {
          errorMessage = error.message
        }
        throw new Error(errorMessage);
      }
    }

  }
  /** * Logs in a user by verifying their credentials and creating a session.
   * @param login The user's login or email.
   * @param password The user's password.
   * @param ipAdress The IP address of the user.
   * @returns An object containing the session token if successful, otherwise false.
   */
  public async login(
    login: string, 
    password: string, 
    ipAdress: string
  ): Promise<{ token: string } | boolean> {

      const user = await this.verifyUserPassword(login, password);
      if (!user) {
          return false;
      }
      const session = await this.session.createSession(user, ipAdress);
      return session;
  }
  /**
   * Logs out a user by deleting their session.
   * @param sessionId The ID of the session to delete.
   * @returns A promise that resolves when the session is deleted.
   */
  public async logout(
    sessionId: string | number
  ): Promise<void> {

      await this.session.deleteSession(sessionId);
      
  }

}