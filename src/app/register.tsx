import { registerApi } from "@/services/authService";
import { authStyles } from "@/styles/authStyles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  type KeyboardTypeOptions,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

interface FieldProps {
  label: string;
  icon: IoniconName;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  disabled: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  // khusus kolom kata sandi
  secure?: boolean;
  visible?: boolean;
  onToggleVisible?: () => void;
}

// Satu baris input berikon, dipakai berulang agar kode tidak panjang
function Field(props: FieldProps) {
  return (
    <View style={authStyles.formGroup}>
      <Text style={authStyles.label}>{props.label}</Text>
      <View
        style={[
          authStyles.inputWrapper,
          props.focused && authStyles.inputWrapperFocused,
        ]}
      >
        <Ionicons
          name={props.icon}
          size={20}
          color={props.focused ? "#2563EB" : "#64748B"}
          style={authStyles.inputIcon}
        />
        <TextInput
          style={authStyles.input}
          placeholder={props.placeholder}
          placeholderTextColor="#94A3B8"
          keyboardType={props.keyboardType}
          autoCapitalize={props.autoCapitalize}
          secureTextEntry={props.secure ? !props.visible : false}
          editable={!props.disabled}
          value={props.value}
          onChangeText={props.onChangeText}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
        />
        {props.secure && (
          <TouchableOpacity
            style={authStyles.eyeButton}
            onPress={props.onToggleVisible}
          >
            <Ionicons
              name={props.visible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#64748B"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

type FieldName =
  | "nama"
  | "email"
  | "noHp"
  | "password"
  | "confirm";

export default function RegisterScreen() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [noHp, setNoHp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<FieldName | null>(null);

  const focusProps = (name: FieldName) => ({
    focused: focusedField === name,
    onFocus: () => setFocusedField(name),
    onBlur: () => setFocusedField(null),
    disabled: loading,
  });

  const handleRegister = async () => {
    if (
      !nama.trim() ||
      !email.trim() ||
      !noHp.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert("Pendaftaran Gagal", "Semua kolom formulir wajib diisi.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Kata Sandi Lemah", "Kata sandi minimal terdiri dari 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Tidak Cocok", "Konfirmasi kata sandi tidak sama dengan kata sandi.");
      return;
    }

    setLoading(true);
    try {
      const result = await registerApi({
        name: nama.trim(),
        email: email.trim(),
        no_hp: noHp.trim(),
        password,
        password_confirmation: confirmPassword,
      });

      Alert.alert(
        "Pendaftaran Berhasil!",
        `Akun atas nama ${result.user.name} telah tersimpan ke database. Silakan masuk melalui halaman Login.`,
        [{ text: "Ke Login", onPress: () => router.back() }],
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mendaftarkan akun.";
      Alert.alert("Pendaftaran Gagal", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={authStyles.safeArea}>
      <KeyboardAvoidingView
        style={authStyles.flexContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={authStyles.topBackButton}
            disabled={loading}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="#0F172A" />
          </TouchableOpacity>

          <View style={authStyles.headerArea}>
            <View style={authStyles.logoBadge}>
              <Ionicons name="person-add" size={28} color="#2563EB" />
            </View>
            <Text style={authStyles.title}>Buat Akun Baru</Text>
            <Text style={authStyles.subtitle}>
              Lengkapi data diri Anda untuk mendaftarkan akun ke server
            </Text>
          </View>

          <View style={authStyles.card}>
            <Field
              label="Nama Lengkap"
              icon="person-outline"
              placeholder="Contoh: Fadli Ansyari"
              value={nama}
              onChangeText={setNama}
              {...focusProps("nama")}
            />
            <Field
              label="Alamat Email"
              icon="mail-outline"
              placeholder="Masukkan alamat email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              {...focusProps("email")}
            />
            <Field
              label="Nomor HP / WhatsApp"
              icon="call-outline"
              placeholder="Contoh: 081234567890"
              keyboardType="phone-pad"
              value={noHp}
              onChangeText={setNoHp}
              {...focusProps("noHp")}
            />
            <Field
              label="Kata Sandi"
              icon="lock-closed-outline"
              placeholder="Minimal 6 karakter"
              autoCapitalize="none"
              secure
              visible={showPassword}
              onToggleVisible={() => setShowPassword(!showPassword)}
              value={password}
              onChangeText={setPassword}
              {...focusProps("password")}
            />
            <Field
              label="Konfirmasi Kata Sandi"
              icon="checkmark-circle-outline"
              placeholder="Ulangi kata sandi"
              autoCapitalize="none"
              secure
              visible={showConfirm}
              onToggleVisible={() => setShowConfirm(!showConfirm)}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              {...focusProps("confirm")}
            />

            <TouchableOpacity
              style={[
                authStyles.primaryButton,
                loading && authStyles.primaryButtonDisabled,
              ]}
              activeOpacity={0.85}
              disabled={loading}
              onPress={handleRegister}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={authStyles.primaryButtonText}>Daftar Akun</Text>
                  <Ionicons name="checkmark" size={19} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>

            <View style={[authStyles.footerRow, { marginTop: 18 }]}>
              <Text style={authStyles.footerText}>Sudah memiliki akun?</Text>
              <TouchableOpacity disabled={loading} onPress={() => router.back()}>
                <Text style={authStyles.footerLink}>Masuk di sini</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
