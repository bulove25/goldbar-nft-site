import { useState } from "react";
import { ethers } from "ethers";

export default function GoldbarNFTMint() {
  const [mintCount, setMintCount] = useState(1);
  const [walletAddress, setWalletAddress] = useState("");
  const [status, setStatus] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWalletAddress(accounts[0]);
    } else {
      alert("메타마스크를 설치해주세요.");
    }
  };

  const handleMint = async () => {
    setStatus("민팅 중...");

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractAddress = "YOUR_CONTRACT_ADDRESS";
      const abi = [
        "function mint(address to, uint256 quantity) public payable"
      ];

      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.mint(walletAddress, mintCount, {
        value: ethers.utils.parseEther("0.01").mul(mintCount),
      });

      await tx.wait();
      setStatus("민팅 성공!");
    } catch (error) {
      console.error(error);
      setStatus("민팅 실패. 콘솔 확인해주세요.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>1g 순금 골드바 NFT 민팅</h1>
      <div style={{ marginTop: 20 }}>
        <label>민팅 수량</label>
        <input
          type="number"
          value={mintCount}
          min={1}
          max={10}
          onChange={(e) => setMintCount(parseInt(e.target.value))}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
        <label>지갑 주소</label>
        <input
          value={walletAddress}
          readOnly
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
        <button onClick={connectWallet} style={{ width: "100%", padding: 10, marginBottom: 10 }}>
          지갑 연결
        </button>
        <button onClick={handleMint} style={{ width: "100%", padding: 10 }}>
          NFT 민팅하기
        </button>
        {status && <p style={{ textAlign: "center", marginTop: 10 }}>{status}</p>}
      </div>
    </div>
  );
}