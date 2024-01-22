import { useTheme } from '@react-navigation/native';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import { useSelector } from 'react-redux';
import Modal from 'react-native-modal';
import i18n from '../../configs/i18n';
import { FlashMessage } from '../../components/FlashMessage/FlashMessage';
import TextDefault from '../../components/Text/TextDefault/TextDefault';
import { alignment } from '../../utils/alignment';
import { scale } from '../../utils/scaling';
import useStyle from './styles';
import { changePassword } from '../../api/Auth/Auth';

function ChangePassword(props) {
  const styles = useStyle();
  const { colors } = useTheme();
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    clearFields();
  }, [props.modalVisible]);

  function clearFields() {
    setOldPassword('');
    setNewPassword('');
    setOldPasswordError('');
    setNewPasswordError('');
  }

  const handleApply = async () => {
    let result = true;
    setIsLoading(true);
    const passwordRegex = /^.{6,}$/;
    setOldPasswordError('');
    setNewPasswordError('');

    if (!passwordRegex.test(oldPassword)) {
      setOldPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
      result = false;
    }
    if (!passwordRegex.test(newPassword)) {
      setNewPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
      result = false;
    }

    if (result) {
      await changePassword({
        access_token: accessToken,
        new_password: newPassword,
        old_password: oldPassword,
      })
        .then((res) => {
          clearFields();
          FlashMessage({ message: 'Đổi mật khẩu thành công' });
          props.hideModal();
          setIsLoading(false);
        })
        .catch((err) => {
          FlashMessage({ message: err });
          setIsLoading(false);
        });
    }
  };

  return (
    <Modal
      onBackButtonPress={props.hideModal}
      onBackdropPress={props.hideModal}
      isVisible={props.modalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.titleContainer}>
            <TextDefault bold H4>
              {i18n.t('changePassword')}
            </TextDefault>
          </View>

          <View style={{ ...alignment.MTsmall }}>
            <TextField
              secureTextEntry
              error={oldPasswordError}
              label={i18n.t('currentPassword')}
              labelFontSize={scale(12)}
              fontSize={scale(12)}
              labelHeight={10}
              textColor={colors.fontMainColor}
              baseColor={colors.fontSecondColor}
              errorColor={colors.errorColor}
              tintColor={colors.tagColor}
              labelTextStyle={{ fontSize: scale(12) }}
              onChangeText={setOldPassword}
              onBlur={() => {
                setOldPasswordError(
                  !oldPassword ? 'Mật khẩu không được để trống' : '',
                );
              }}
            />
          </View>
          <View style={{ ...alignment.MTmedium }}>
            <TextField
              secureTextEntry
              error={newPasswordError}
              label={i18n.t('newPassword')}
              labelFontSize={scale(12)}
              fontSize={scale(12)}
              labelHeight={10}
              textColor={colors.fontMainColor}
              baseColor={colors.fontSecondColor}
              errorColor={colors.errorColor}
              tintColor={colors.tagColor}
              labelTextStyle={{ fontSize: scale(12) }}
              onChangeText={setNewPassword}
              onBlur={() => {
                setNewPasswordError(
                  !newPassword ? 'Mật khẩu không được để trống' : '',
                );
              }}
            />
          </View>

          <TouchableOpacity
            disabled={isLoading}
            onPress={() => handleApply()}
            style={[styles.btnContainer]}>
            <TextDefault textColor={colors.background} bold H5>
              {i18n.t('apply')}
            </TextDefault>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

ChangePassword.propTypes = {
  hideModal: PropTypes.func,
  modalVisible: PropTypes.bool.isRequired,
};
export default ChangePassword;
