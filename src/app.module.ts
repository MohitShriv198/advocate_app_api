import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserInfoModule } from './user-info/user-info.module';
// import { PrivateContactsModule } from './private-contacts/private-contacts.module';
// import { ContactAddressModule } from './contact-address/contact-address.module';
// import { ContactPhoneNumbersModule } from './contact-phone-numbers/contact-phone-numbers.module';
// import { PaymentsModule } from './payments/payments.module';
// import { SubscriptionsModule } from './subscriptions/subscriptions.module';
// import { SubscriptionPackagesModule } from './subscription-packages/subscription-packages.module';
// import { SubscriptionsPackagesFeaturesModule } from './subscriptions-packages-features/subscriptions-packages-features.module';
import { NotesModule } from './notes/notes.module';
// import { ChatRoomsModule } from './chat-rooms/chat-rooms.module';
// import { ChatMessagesController } from './chat-messages/chat-messages.controller';
// import { ChatMessagesModule } from './chat-messages/chat-messages.module';
// import { ChatOccupantsModule } from './chat-occupants/chat-occupants.module';
// import { ContactsInvitesRequestsModule } from './contacts-invites-requests/contacts-invites-requests.module';
// import { ContactsInvitesModule } from './contacts-invites/contacts-invites.module';
import { EmailModule } from './email/email.module';
import { TwilioModule } from './twilio/twilio.module';
import { SecurityQuestionsModule } from './admin/security-questions/security-questions.module';
import { UsersSecurityQuestionsModule } from './admin/users-security-questions/users-security-questions.module';
import { AuthAdminModule } from './admin/auth-admin/auth-admin.module';
// import { FcmNotificationModule } from './fcm-notification/fcm-notification.module';
import { CmsPagesModule } from './cms-pages/cms-pages.module';
// import { CometchatModule } from './cometchat/cometchat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          host: config.get('MYSQLDB_HOST'),
          port: config.get('MYSQLDB_LOCAL_PORT'),
          username: config.get('MYSQLDB_USERNAME'),
          password: config.get('MYSQLDB_PASSWORD'),
          database: config.get('MYSQLDB_DATABASE'),
          entities: ['**/*.entity.js'],
          synchronize: true,
        };
      },
    }),
    AuthModule,
    AuthAdminModule,
    UsersModule,
    UserInfoModule,
    // PrivateContactsModule,
    // ContactAddressModule,
    // ContactPhoneNumbersModule,
    // PaymentsModule,
    // SubscriptionsModule,
    // SubscriptionPackagesModule,
    // SubscriptionsPackagesFeaturesModule,
    NotesModule,
    // ChatRoomsModule,
    // ChatMessagesModule,
    // ChatOccupantsModule,
    // ContactsInvitesRequestsModule,
    // ContactsInvitesModule,
    EmailModule,
    TwilioModule,
    SecurityQuestionsModule,
    UsersSecurityQuestionsModule,
    // FcmNotificationModule,
    CmsPagesModule,
    // CometchatModule,
  ],
  controllers: [AppController],    //ChatMessagesController
  providers: [AppService],
})
export class AppModule {}
