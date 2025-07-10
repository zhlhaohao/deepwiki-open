# 记录

使用 adalflow 库构建流水线。
包括文本分割器 (TextSplitter) 和嵌入转换器 (ToEmbeddings 或 OllamaDocumentProcessor)。
流水线通过 adal.Sequential 将这些组件串联，形成从文本分割到嵌入的处理流程。
嵌入模型：

支持多种嵌入模型，包括 OpenAI 兼容模型和 Ollama 本地模型。
模型配置通过 api/config/embedder.json 文件定义，支持自定义模型选择。
如果使用 Ollama，则通过 OllamaDocumentProcessor 单文档处理；否则通过 ToEmbeddings 进行批量处理。
数据库存储：

使用 LocalDB 类来创建、加载和管理本地数据库。
数据库支持注册转换器 (register_transformer)，并可以保存和加载状态 (save_state, load)。
嵌入后的数据以转换后的格式存储，可以通过 get_transformed_data 获取。
文件获取与处理：

prepare_data_pipeline 创建文件转换管道。文件切割 --> 嵌入向量

websocket_wiki 调用 prepare_retriever

1. rag.py/prepare_retriever
- prepare_database: 为仓库创建本地向量数据库.
  - reset_database()
  - _create_repo(repo_url_or_path, type, access_token): 下载仓库的文件到本地仓库
  - prepare_db_index 向量数据库,将本地仓库的文件向量化并存储
    - read_all_documents 函数读取本地仓库的所有文件，并准备为 Adalflow 的 Documents 对象列表。
    - transform_documents_and_save_to_db 函数对Documents进行转换并保存到本地数据库。
- _validate_and_filter_embeddings: 验证和过滤嵌入向量。
- self.retriever = FAISSRetriever(): 创建向量数据库检索器


配置与环境变量：
