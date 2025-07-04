import adalflow as adal

from api.config import configs


def get_embedder() -> adal.Embedder:
    # 从配置中获取嵌入模型的配置信息
    embedder_config = configs["embedder"]

    # --- 初始化嵌入器 ---
    # 获取模型客户端类（如 OpenAI、Ollama 等）
    model_client_class = embedder_config["model_client"]

    # 如果配置中有初始化参数，则使用这些参数创建模型客户端实例
    if "initialize_kwargs" in embedder_config:
        model_client = model_client_class(**embedder_config["initialize_kwargs"])
    else:
        # 否则直接实例化模型客户端
        model_client = model_client_class()

    # 创建 Embedder 实例，传入模型客户端和模型参数
    embedder = adal.Embedder(
        model_client=model_client,
        model_kwargs=embedder_config["model_kwargs"],
    )

    # 返回构建好的嵌入器
    return embedder
