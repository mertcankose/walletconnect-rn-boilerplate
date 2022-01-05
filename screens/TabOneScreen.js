import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../components/Themed";

//import EditScreenInfo from "../components/EditScreenInfo";
//import { RootTabScreenProps } from "../types";

import { useWalletConnect } from "@walletconnect/react-native-dapp";

const shortenAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(address.length - 4, address.length)}`;
};

export default function TabOneScreen({ navigation }) {
  const connector = useWalletConnect();

  const connectWallet = useCallback(() => {
    return connector.connect();
  }, [connector]);

  const killSession = useCallback(() => {
    return connector.killSession();
  }, [connector]);

  const sendTransaction = useCallback(async () => {
    try {
      const response = await connector.sendTransaction({
        data: "0x21",
        from: `${connector.accounts}`,
        to: "0x2D356Dfe24d8E2AbA951020769A67bb9e2084ff0",
        value: "1000000000000000",
      });
      console.log("sendTransResponse:", response);
    } catch (e) {
      console.log("Send Transaction Error Name: " + e.name + "\nSign Message Error Description: " + e.message);
    }
  }, [connector]);

  const signPersonalMessage = useCallback(async () => {
    const message = "0x21";

    try {
      const response = await connector.signPersonalMessage([message, connector.accounts[0].toLowerCase()]);
      console.log("Sign Success Response: ", response);
    } catch (e) {
      console.log("Sign Message Error Name: " + e.name + "\nSign Message Error Description: " + e.message);
    }
  }, [connector]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {!connector.connected && (
        <TouchableOpacity onPress={connectWallet} style={styles.buttonStyle}>
          <Text style={styles.buttonTextStyle}>Connect a Wallet</Text>
        </TouchableOpacity>
      )}
      {!!connector.connected && (
        <>
          <Text>{shortenAddress(connector.accounts[0])}</Text>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => sendTransaction(connector.accounts[0])}>
            <Text style={styles.buttonTextStyle}>Send Transaction</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => signPersonalMessage(connector.accounts[0])}>
            <Text style={styles.buttonTextStyle}>Sign Message</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={killSession} style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Log out</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  buttonStyle: {
    backgroundColor: "#3399FF",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#3399FF",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: "600",
  },
});
