import { FieldExtensionSDK } from '@contentful/app-sdk';
import { Flex, IconButton, TextInput } from '@contentful/f36-components';
import { CycleIcon, EditIcon } from '@contentful/f36-icons';
import { useSDK } from '@contentful/react-apps-toolkit';
import { useEffect, useState } from 'react';

const generateRandomSecret = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const SecretField = () => {
  const sdk = useSDK<FieldExtensionSDK>();
  const secretLength = sdk.parameters.instance.secretLength || 32;
  const [secret, setSecret] = useState(sdk.field.getValue() || '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    sdk.window.startAutoResizer();
    if (!secret) {
      const newSecret = generateRandomSecret(secretLength);
      setSecret(newSecret);
      sdk.field.setValue(newSecret);
    }
  }, [sdk, secret, secretLength]);

  const refreshSecret = () => {
    const newSecret = generateRandomSecret(secretLength);
    setSecret(newSecret);
    sdk.field.setValue(newSecret);
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return (
    <Flex alignItems="center" gap="spacingS">
      <TextInput
        isDisabled={!isEditing}
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
        style={{ flex: 1 }}
      />
      {isEditing && (
        <IconButton
          icon={<CycleIcon />}
          aria-label="Refresh Secret"
          onClick={refreshSecret}
          variant="secondary"
        />
      )}
      <IconButton
        icon={<EditIcon />}
        isActive={isEditing}
        aria-label="Toggle Edit Mode"
        onClick={toggleEditMode}
        variant="secondary"
      />
    </Flex>
  );
};

export default SecretField;
