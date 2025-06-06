# Lũy thừa nhị phân

## Thuật toán

Lũy thừa nhị phân (còn gọi là bình phương và nhân - exponentiation by squaring) là một kỹ thuật chung để tính $a^n$ chỉ với $O(\log n)$ phép nhân (thay vì $O(n)$ phép nhân được yêu cầu bởi cách tiếp cận ngây thơ).

Nó cũng có các ứng dụng quan trọng trong nhiều nhiệm vụ không liên quan đến số học, vì nó có thể được sử dụng với bất kỳ phép toán nào có tính chất kết hợp:

$$(X \cdot Y) \cdot Z = X \cdot (Y \cdot Z)$$

Quan trọng nhất, phép nhân ma trận có tính kết hợp, và do đó, chúng ta có thể tìm $A^n$ trong thời gian $O(\log n)$.

### Thuật toán

Việc tính $a^n$ một cách ngây thơ sẽ yêu cầu $n-1$ phép nhân, nhưng với lũy thừa nhị phân, bạn có thể tính nó trong $O(\log n)$ phép nhân.

Ý tưởng là chúng ta tách công việc bằng cách sử dụng biểu diễn nhị phân của số mũ.

Hãy viết $n$ ở dạng nhị phân, ví dụ:
$$3^{13} = 3^{1101_2} = 3^{2^3} \cdot 3^{2^2} \cdot 3^{2^0}$$

Vì tổng số bit được đặt trong biểu diễn nhị phân của $n$ nhiều nhất là $\lfloor \log_2 n \rfloor + 1$, nên chúng ta chỉ cần thực hiện $O(\log n)$ phép nhân nếu chúng ta biết lũy thừa $a^{2^0}, a^{2^1}, a^{2^2}, \ldots, a^{\lfloor \log n \rfloor}$.

Vì vậy, chúng ta chỉ cần biết một cách nhanh để tính chúng. May mắn thay, điều này rất dễ dàng, vì một phần tử trong chuỗi chính là bình phương của phần tử trước đó.

$$\begin{align}
3^{2^0} &= 3 \\
3^{2^1} &= (3^{2^0})^2 = 3^2 = 9 \\
3^{2^2} &= (3^{2^1})^2 = 9^2 = 81 \\
3^{2^3} &= (3^{2^2})^2 = 81^2 = 6561
\end{align}$$

Vì vậy, để có câu trả lời $3^{13}$, chúng ta chỉ cần nhân ba trong số chúng (bỏ qua $3^{2^1}$ vì bit tương ứng không được đặt trong biểu diễn nhị phân của $13$): $3^{13} = 6561 \cdot 81 \cdot 3 = 1594323$

Độ phức tạp cuối cùng là $O(\log n)$ phép nhân.

### Cài đặt

Đầu tiên chúng ta sẽ trình bày cách tiếp cận đệ quy, phản ánh trực tiếp định nghĩa đệ quy của $a^n$:

$$a^n = \begin{cases}
1 &\text{if } n = 0 \\
\left(a^{\frac{n}{2}}\right)^2 &\text{if } n > 0 \text{ and } n \text{ even}\\
\left(a^{\frac{n - 1}{2}}\right)^2 \cdot a &\text{if } n > 0 \text{ and } n \text{ odd}\\
\end{cases}$$

```cpp
long long binpow(long long a, long long b) {
    if (b == 0)
        return 1;
    long long res = binpow(a, b / 2);
    if (b % 2)
        return res * res * a;
    else
        return res * res;
}
```

**Python:**
```python
def binpow_recursive(a, b):
    """Lũy thừa nhị phân đệ quy"""
    if b == 0:
        return 1
    res = binpow_recursive(a, b // 2)
    if b % 2:
        return res * res * a
    else:
        return res * res
```

Cách tiếp cận thứ hai loại bỏ đệ quy. Nó tính tất cả các lũy thừa trong một vòng lặp và nhân các lũy thừa tương ứng với các bit được đặt trong $n$. Mặc dù độ phức tạp của cả hai cách tiếp cận đều giống nhau, nhưng cách tiếp cận lặp sẽ nhanh hơn một chút trong thực tế vì chúng ta không có chi phí từ các lệnh gọi đệ quy.

```cpp
long long binpow(long long a, long long b) {
    long long res = 1;
    while (b > 0) {
        if (b & 1)
            res = res * a;
        a = a * a;
        b >>= 1;
    }
    return res;
}
```

**Python:**
```python
def binpow(a, b):
    """Lũy thừa nhị phân lặp"""
    res = 1
    while b > 0:
        if b & 1:
            res = res * a
        a = a * a
        b >>= 1
    return res
```

## Ứng dụng

### Tính toán hiệu quả các số mũ lớn modulo một số

**Bài toán:** Tính $x^n \bmod m$. Đây là một phép toán rất phổ biến. Ví dụ, nó được sử dụng trong việc tính hàm băm modular. Nếu chúng ta muốn tính $x^n \bmod m$, thì chúng ta có thể sử dụng thuật toán lũy thừa nhị phân và thay thế tất cả các phép nhân bằng phép nhân modular.

Vấn đề với cách tiếp cận trên là khi $m$ có thể so sánh với giới hạn int, phép toán $(a \cdot b) \bmod m$ có thể dẫn đến overflow ngay cả khi $a < m$ và $b < m$ (ví dụ, nếu $m = 10^9+7$ và $a = b = 10^9$, thì $a \cdot b = 10^{18}$). May mắn thay, chúng ta có thể tính toán $a \cdot b \bmod m$ mà không có overflow dưới một giả định.

Giả định: Chúng ta có thể tính toán sự khác biệt và tổng modulo $m$ không có overflow và giá trị $m$ là số nguyên 32-bit: $(a + m) \bmod m = a$ và $(a - m) \bmod m = a$ với $0 \le a < m$. Điều này đúng cho $m < 2^{31}$ với nguyên 64-bit có dấu.

**Giải pháp:** Vì $a \cdot b = a \cdot b \bmod m \cdot q + a \cdot b \bmod m$ và $a \cdot b \bmod m < m$, chúng ta có $q = \lfloor a \cdot b / m \rfloor$.

Xác định sai số $c = q - \lfloor a \cdot b / m \rfloor$. Chúng ta có thể tính toán $a \cdot b \bmod m = a \cdot b - m \cdot q$ ngay cả khi chúng ta tính toán $q$ với sai số $c$, miễn là $a \cdot b - m \cdot q$ nằm giữa $-m$ và $2 \cdot m$. Vì $a \cdot b - m \cdot q = m \cdot c + (a \cdot b \bmod m)$ và $(a \cdot b \bmod m) < m$, thì điều kiện trên tương đương với $-2 < c < 1$.

Mẹo được tính toán $\lfloor a \cdot b / m \rfloor$ như `(uint64_t)((long double)a * b / m)` bằng kiểu số thực. Cách làm này dẫn đến sai số nhỏ và có thể tính toán đúng ngay cả cho các giá trị $a, b, m$ lớn (tất cả lên đến $10^{15}$ đều hoạt động tốt). Sau khi tính toán $q$, dễ dàng tính toán $a \cdot b - m \cdot q$ với phép tính không dấu, sau đó chuẩn hóa giá trị thành phạm vi $[0, m)$.

```cpp
using u64 = uint64_t;
using u128 = __uint128_t;
using i64 = int64_t;
i64 modmul(i64 a, i64 b, i64 m) {
    i64 res = (i64)((u128)a * b % m);
    return res;
}

i64 modpow(i64 a, i64 b, i64 m) {
    a %= m;
    i64 res = 1;
    while (b > 0) {
        if (b & 1)
            res = modmul(res, a, m);
        a = modmul(a, a, m);
        b >>= 1;
    }
    return res;
}
```

**Python:**
```python
def modpow(a, b, m):
    """Lũy thừa nhị phân với modulo"""
    a %= m
    res = 1
    while b > 0:
        if b & 1:
            res = (res * a) % m
        a = (a * a) % m
        b >>= 1
    return res

# Hoặc sử dụng hàm có sẵn
def modpow_builtin(a, b, m):
    """Sử dụng hàm pow có sẵn của Python"""
    return pow(a, b, m)
```

**Lưu ý:** Nếu $m$ là một số nguyên 64 bit, mọi thứ trở nên phức tạp hơn, vì các kiểu tích hợp không đủ lớn. Một giải pháp là sử dụng thư viện BigInteger, nhưng rất chậm. Một giải pháp khác là sử dụng Newton-Raphson để chia: <https://en.wikipedia.org/wiki/Division_algorithm#Newton%E2%80%93Raphson_division>. Cuối cùng, chúng ta có thể sử dụng lũy thừa nhị phân cho phép nhân modulo. Đây được mô tả trong phần sau.

### Tính toán hiệu quả các số Fibonacci

**Bài toán:** Tính số Fibonacci thứ $n-th$: $F_n$.

**Giải pháp:** Để biết thêm chi tiết, hãy xem bài viết Số Fibonacci. Chúng ta sẽ chỉ trình bày một phát hiện ở đây.

Dễ dàng kiểm tra rằng công thức sau đây đúng:
$$\begin{pmatrix}F_{n-1} & F_{n} \\ F_{n} & F_{n+1}\end{pmatrix} = \begin{pmatrix}0 & 1 \\ 1 & 1\end{pmatrix}^n$$

Do đó, để tìm $F_n$, chúng ta phải tăng ma trận lên lũy thừa $n$. Điều này có thể được thực hiện trong $O(\log n)$.

### Áp dụng một hoán vị $k$ lần

**Bài toán:** Cho một dãy có độ dài $n$. Áp dụng cho nó một hoán vị đã cho $k$ lần.

**Giải pháp:** Đơn giản chỉ cần tăng hoán vị lên lũy thừa $k$ bằng lũy thừa nhị phân, và sau đó áp dụng nó vào dãy. Điều này sẽ cho chúng ta thời gian phức tạp $O(n \log k)$.

```cpp
vector<int> applyPermutation(vector<int> sequence, vector<int> permutation) {
    vector<int> newSequence(sequence.size());
    for(int i = 0; i < sequence.size(); i++) {
        newSequence[i] = sequence[permutation[i]];
    }
    return newSequence;
}

vector<int> permute(vector<int> sequence, vector<int> permutation, long long k) {
    while (k > 0) {
        if (k & 1) {
            sequence = applyPermutation(sequence, permutation);
        }
        permutation = applyPermutation(permutation, permutation);
        k >>= 1;
    }
    return sequence;
}
```

**Python:**
```python
def apply_permutation(sequence, permutation):
    """Áp dụng một hoán vị cho dãy"""
    return [sequence[permutation[i]] for i in range(len(sequence))]

def permute(sequence, permutation, k):
    """Áp dụng hoán vị k lần bằng lũy thừa nhị phân"""
    while k > 0:
        if k & 1:
            sequence = apply_permutation(sequence, permutation)
        permutation = apply_permutation(permutation, permutation)
        k >>= 1
    return sequence

# Ví dụ sử dụng:
# sequence = [1, 2, 3, 4, 5]
# permutation = [1, 0, 3, 2, 4]  # swap 0<->1, 2<->3, 4 stays
# result = permute(sequence, permutation, 3)
```

**Lưu ý:** Bài toán này có thể được giải quyết hiệu quả hơn trong thời gian tuyến tính bằng cách xây dựng đồ thị hoán vị và xem xét từng chu trình độc lập. Sau đó, bạn có thể tính $k$ modulo kích thước của chu trình và tìm vị trí cuối cùng cho mỗi số là một phần của chu trình này.

### Áp dụng nhanh một tập hợp các phép toán hình học cho một tập hợp các điểm

**Bài toán:** Cho $n$ điểm $p_i$, áp dụng $m$ phép biến đổi cho mỗi điểm này. Mỗi phép biến đổi có thể là một phép dịch chuyển, một phép co giãn hoặc một phép quay quanh một trục cho trước theo một góc cho trước. Cũng có một thao tác "vòng lặp" áp dụng một danh sách các phép biến đổi đã cho $k$ lần (các thao tác "vòng lặp" có thể được lồng nhau). Bạn nên áp dụng tất cả các phép biến đổi nhanh hơn $O(n \cdot length)$, trong đó $length$ là tổng số phép biến đổi được áp dụng (sau khi mở các thao tác "vòng lặp").

**Giải pháp:** Hãy xem cách các loại biến đổi khác nhau thay đổi tọa độ:

* Phép dịch chuyển: thêm một hằng số khác nhau vào mỗi tọa độ.
* Phép co giãn: nhân mỗi tọa độ với một hằng số khác nhau.
* Phép quay: phép biến đổi phức tạp hơn (chúng ta sẽ không đi vào chi tiết ở đây), nhưng mỗi tọa độ mới vẫn có thể được biểu diễn dưới dạng tổ hợp tuyến tính của các tọa độ cũ.

Như bạn có thể thấy, mỗi phép biến đổi có thể được biểu diễn dưới dạng một phép toán tuyến tính trên các tọa độ. Do đó, một phép biến đổi có thể được viết dưới dạng ma trận $4 \times 4$ có dạng:

$$\begin{pmatrix} a_{11} & a_{12} & a_{13} & a_{14} \\ a_{21} & a_{22} & a_{23} & a_{24} \\ a_{31} & a_{32} & a_{33} & a_{34} \\ a_{41} & a_{42} & a_{43} & a_{44} \end{pmatrix}$$

khi nhân với một vector với các tọa độ cũ và một đơn vị sẽ cho một vector mới với các tọa độ mới và một đơn vị:

$$\begin{pmatrix} x & y & z & 1 \end{pmatrix} \cdot \begin{pmatrix} a_{11} & a_{12} & a_{13} & a_{14} \\ a_{21} & a_{22} & a_{23} & a_{24} \\ a_{31} & a_{32} & a_{33} & a_{34} \\ a_{41} & a_{42} & a_{43} & a_{44} \end{pmatrix} = \begin{pmatrix} x' & y' & z' & 1 \end{pmatrix}$$

(Tại sao lại giới thiệu một tọa độ thứ tư giả tạo, bạn hỏi? Đó là vẻ đẹp của tọa độ thuần nhất, tìm thấy ứng dụng tuyệt vời trong đồ họa máy tính. Nếu không có điều này, sẽ không thể thực hiện các phép toán affine như phép dịch chuyển dưới dạng một phép nhân ma trận duy nhất, vì nó yêu cầu chúng ta _thêm_ một hằng số vào các tọa độ. Phép biến đổi affine trở thành phép biến đổi tuyến tính trong chiều cao hơn!)

Dưới đây là một số ví dụ về cách các phép biến đổi được biểu diễn dưới dạng ma trận:

* Phép dịch chuyển: dịch chuyển tọa độ $x$ đi $5$, tọa độ $y$ đi $7$ và tọa độ $z$ đi $9$.

$$\begin{pmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 5 & 7 & 9 & 1 \end{pmatrix}$$

* Phép co giãn: co giãn tọa độ $x$ với hệ số $10$ và hai tọa độ còn lại với hệ số $5$.

$$\begin{pmatrix} 10 & 0 & 0 & 0 \\ 0 & 5 & 0 & 0 \\ 0 & 0 & 5 & 0 \\ 0 & 0 & 0 & 1 \end{pmatrix}$$

* Phép quay: quay $\theta$ độ quanh trục $x$ theo quy tắc bàn tay phải (hướng ngược chiều kim đồng hồ).

$$\begin{pmatrix} 1 & 0 & 0 & 0 \\ 0 & \cos \theta & -\sin \theta & 0 \\ 0 & \sin \theta & \cos \theta & 0 \\ 0 & 0 & 0 & 1 \end{pmatrix}$$

Bây giờ, một khi mọi phép biến đổi được mô tả dưới dạng ma trận, chuỗi các phép biến đổi có thể được mô tả dưới dạng tích của các ma trận này, và một "vòng lặp" gồm $k$ lần lặp có thể được mô tả dưới dạng ma trận được nâng lên lũy thừa $k$ (có thể được tính toán bằng lũy thừa nhị phân trong $O(\log{k})$). Bằng cách này, ma trận biểu diễn tất cả các phép biến đổi có thể được tính toán trước trong $O(m \log{k})$, sau đó nó có thể được áp dụng cho mỗi điểm trong $n$ điểm trong $O(n)$ với tổng độ phức tạp là $O(n + m \log{k})$.

### Số đường đi có độ dài $k$ trong đồ thị

**Bài toán:** Cho một đồ thị có hướng không có trọng số gồm $n$ đỉnh, tìm số đường đi có độ dài $k$ từ bất kỳ đỉnh $u$ nào đến bất kỳ đỉnh $v$ nào khác.

**Giải pháp:** Bài toán này được xem xét chi tiết hơn trong một bài viết riêng. Thuật toán bao gồm việc nâng ma trận kề $M$ của đồ thị (một ma trận trong đó $m_{ij} = 1$ nếu có cạnh từ $i$ đến $j$, hoặc $0$ nếu ngược lại) lên lũy thừa thứ $k$. Bây giờ $m_{ij}$ sẽ là số đường đi có độ dài $k$ từ $i$ đến $j$. Độ phức tạp thời gian của giải pháp này là $O(n^3 \log k)$.

**Lưu ý:** Trong cùng một bài viết đó, một biến thể khác của bài toán này được xem xét: khi các cạnh có trọng số và yêu cầu tìm đường đi có trọng số tối thiểu chứa chính xác $k$ cạnh. Như được trình bày trong bài viết đó, bài toán này cũng được giải quyết bằng cách lũy thừa ma trận kề. Ma trận sẽ có trọng số của cạnh từ $i$ đến $j$, hoặc $\infty$ nếu không có cạnh như vậy. Thay vì phép toán thông thường của việc nhân hai ma trận, một phép toán đã sửa đổi nên được sử dụng: thay vì phép nhân, cả hai giá trị được cộng lại, và thay vì tổng, một giá trị tối thiểu được lấy. Đó là: $result_{ij} = \min\limits_{1\ \leq\ k\ \leq\ n}(a_{ik} + b_{kj})$.

### Biến thể của lũy thừa nhị phân: nhân hai số modulo $m$

**Bài toán:** Nhân hai số $a$ và $b$ modulo $m$. $a$ và $b$ phù hợp với các kiểu dữ liệu tích hợp, nhưng tích của chúng quá lớn để vừa với số nguyên 64-bit. Ý tưởng là tính $a \cdot b \pmod m$ mà không sử dụng số học bignum.

**Giải pháp:** Chúng ta chỉ cần áp dụng thuật toán xây dựng nhị phân được mô tả ở trên, chỉ thực hiện phép cộng thay vì phép nhân. Nói cách khác, chúng ta đã "mở rộng" phép nhân của hai số thành $O (\log m)$ phép toán cộng và nhân với hai (về cơ bản, là một phép cộng).

$$a \cdot b = \begin{cases} 0 &\text{if }a = 0 \\ 2 \cdot \frac{a}{2} \cdot b &\text{if }a > 0 \text{ and }a \text{ even} \\ 2 \cdot \frac{a-1}{2} \cdot b + b &\text{if }a > 0 \text{ and }a \text{ odd} \end{cases}$$

**Lưu ý:** Bạn có thể giải quyết nhiệm vụ này theo cách khác bằng cách sử dụng các phép toán dấu phẩy động. Đầu tiên tính toán biểu thức $\frac{a \cdot b}{m}$ sử dụng số dấu phẩy động và ép kiểu thành số nguyên không dấu $q$. Trừ $q \cdot m$ từ $a \cdot b$ sử dụng số học số nguyên không dấu và lấy modulo $m$ để tìm câu trả lời. Giải pháp này trông khá không đáng tin cậy, nhưng nó rất nhanh và rất dễ thực hiện. Xem ở đây để biết thêm thông tin.

## Bài tập thực hành

* UVa 1230 - MODEX
* UVa 374 - Big Mod
* UVa 11029 - Leading and Trailing
* Codeforces - Parking Lot
* leetcode - Count good numbers
* Codechef - Chef and Riffles
* Codeforces - Decoding Genome
* Codeforces - Neural Network Country
* Codeforces - Magic Gems
* SPOJ - The last digit
* SPOJ - Locker
* LA - 3722 Jewel-eating Monsters
* SPOJ - Just add it
* Codeforces - Stairs and Lines